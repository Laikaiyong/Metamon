package system

import (
	"fmt"
	comp "metamon/component"
	"metamon/msg"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/filter"
	"pkg.world.dev/world-engine/cardinal/types"
)

func PurchaseItemSystem(world cardinal.WorldContext) error {
	return cardinal.EachMessage[msg.PurchaseItemMsg, msg.PurchaseItemResult](
		world,
		func(purchase cardinal.TxData[msg.PurchaseItemMsg]) (msg.PurchaseItemResult, error) {
			// Get user's owner component
			var ownerID types.EntityID

			err := cardinal.NewSearch().Entity(
				filter.Exact(filter.Component[comp.Owner]())).
				Each(world, func(id types.EntityID) bool {
					o, err := cardinal.GetComponent[comp.Owner](world, id)
					if err != nil {
						return true
					}
					if o.Address == purchase.Msg.Owner {
						ownerID = id
						return false
					}
					return true
				})

			if err != nil {
				return msg.PurchaseItemResult{Success: false}, fmt.Errorf("owner not found")
			}

			// Create new shop item
			newItem := comp.ShopItem{
				Title:       purchase.Msg.Title,
				Type:        purchase.Msg.Type,
				Description: purchase.Msg.Description,
				Image:       purchase.Msg.Image,
				Price:       purchase.Msg.Price,
			}

			// Get or create inventory
			inventory, err := cardinal.GetComponent[comp.OwnerShopItem](world, ownerID)
			if err != nil {
				// Create new inventory
				inventory = &comp.OwnerShopItem{
					Owner: purchase.Msg.Owner,
					Items: []comp.ShopItem{},
				}
				_, err = cardinal.Create(world, inventory)
				if err != nil {
					return msg.PurchaseItemResult{Success: false}, fmt.Errorf("failed to create inventory: %v", err)
				}
			}

			// Add items
			for i := uint32(0); i < purchase.Msg.Amount; i++ {
				inventory.Items = append(inventory.Items, newItem)
			}

			err = cardinal.SetComponent(world, ownerID, inventory)
			if err != nil {
				return msg.PurchaseItemResult{Success: false}, fmt.Errorf("failed to update inventory: %v", err)
			}

			return msg.PurchaseItemResult{
				Success: true,
				Item:    newItem,
			}, nil
		})
}

func ConsumeItemSystem(world cardinal.WorldContext) error {
	return cardinal.EachMessage[msg.ConsumeItemMsg, msg.ConsumeItemResult](
		world,
		func(consume cardinal.TxData[msg.ConsumeItemMsg]) (msg.ConsumeItemResult, error) {
			// Get user's owner component
			var ownerID types.EntityID
			var consumedItem comp.ShopItem

			err := cardinal.NewSearch().Entity(
				filter.Exact(filter.Component[comp.Owner]())).
				Each(world, func(id types.EntityID) bool {
					o, err := cardinal.GetComponent[comp.Owner](world, id)
					if err != nil {
						return true
					}
					if o.Address == consume.Msg.Owner {
						ownerID = id
						return false
					}
					return true
				})
			if err != nil {
				return msg.ConsumeItemResult{Success: false}, err
			}

			// Get user's inventory
			inventory, err := cardinal.GetComponent[comp.OwnerShopItem](world, ownerID)
			if err != nil {
				return msg.ConsumeItemResult{Success: false}, err
			}

			// Count available items and store item details
			itemCount := uint32(0)
			for _, item := range inventory.Items {
				if item.Title == consume.Msg.Title && item.Type == consume.Msg.Type {
					itemCount++
					consumedItem = item // Store item details for response
				}
			}

			// Check if user has enough items
			if itemCount < consume.Msg.Amount {
				return msg.ConsumeItemResult{
					Success:  false,
					Quantity: itemCount,
					Item:     consumedItem,
				}, nil
			}

			// Remove consumed items
			newItems := []comp.ShopItem{}
			remainingToRemove := consume.Msg.Amount
			for _, item := range inventory.Items {
				if item.Title == consume.Msg.Title &&
					item.Type == consume.Msg.Type &&
					remainingToRemove > 0 {
					remainingToRemove--
					continue
				}
				newItems = append(newItems, item)
			}

			// Update inventory
			inventory.Items = newItems
			if err := cardinal.SetComponent(world, ownerID, inventory); err != nil {
				return msg.ConsumeItemResult{Success: false}, err
			}

			return msg.ConsumeItemResult{
				Success:  true,
				Quantity: itemCount - consume.Msg.Amount,
				Item:     consumedItem,
			}, nil
		})
}
