package system

import (
	"metamon/component"
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
			var owner comp.Owner
			var ownerID types.EntityID

			err := cardinal.NewSearch().Entity(
				filter.Exact(filter.Component[comp.Owner]())).
				Each(world, func(id types.EntityID) bool {
					o, err := cardinal.GetComponent[comp.Owner](world, id)
					if err != nil {
						return true
					}
					if o.Address == purchase.Msg.Owner {
						owner = *o
						ownerID = id
						return false
					}
					return true
				})
			if err != nil {
				return msg.PurchaseItemResult{Success: false}, err
			}

			// Get shop item
			var item comp.ShopItem

			err = cardinal.NewSearch().Entity(
				filter.Exact(filter.Component[comp.ShopItem]())).
				Each(world, func(id types.EntityID) bool {
					o, err := cardinal.GetComponent[comp.ShopItem](world, id)
					if err != nil {
						return true
					}
					if o.Title == purchase.Msg.ItemID {
						item = *o
						return false
					}
					return true
				})
			if err != nil {
				return msg.PurchaseItemResult{Success: false}, err
			}

			// Calculate total cost
			totalCost := item.Price * float64(purchase.Msg.Amount)

			// Check if user has enough balance
			if float64(owner.Balance) < totalCost {
				return msg.PurchaseItemResult{
					Success: false,
					Balance: uint64(owner.Balance),
				}, nil
			}

			owner.Balance -= int64(totalCost)
			if err := cardinal.SetComponent(world, ownerID, &owner); err != nil {
				return msg.PurchaseItemResult{Success: false}, err
			}

			// Add items to user's inventory
			inventory, err := cardinal.GetComponent[component.OwnerShopItem](world, ownerID)
			if err != nil {
				inventory = &component.OwnerShopItem{
					Owner: purchase.Msg.Owner,
					Items: []component.ShopItem{},
				}
			}

			// Add purchased items
			for i := uint32(0); i < purchase.Msg.Amount; i++ {
				inventory.Items = append(inventory.Items, item)
			}

			if err := cardinal.SetComponent(world, ownerID, inventory); err != nil {
				return msg.PurchaseItemResult{Success: false}, err
			}

			return msg.PurchaseItemResult{
				Success: true,
				Balance: uint64(owner.Balance),
			}, nil
		})
}

func ConsumeItemSystem(world cardinal.WorldContext) error {
	return cardinal.EachMessage[msg.ConsumeItemMsg, msg.ConsumeItemResult](
		world,
		func(consume cardinal.TxData[msg.ConsumeItemMsg]) (msg.ConsumeItemResult, error) {
			// Get user's owner component
			var ownerID types.EntityID

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
			inventory, err := cardinal.GetComponent[component.OwnerShopItem](world, ownerID)
			if err != nil {
				return msg.ConsumeItemResult{Success: false}, err
			}

			// Count available items
			itemCount := uint32(0)
			for _, item := range inventory.Items {
				if item.Title == consume.Msg.ItemID {
					itemCount++
				}
			}

			// Check if user has enough items
			if itemCount < consume.Msg.Amount {
				return msg.ConsumeItemResult{
					Success:  false,
					Quantity: itemCount,
				}, nil
			}

			// Remove consumed items
			newItems := []component.ShopItem{}
			remainingToRemove := consume.Msg.Amount
			for _, item := range inventory.Items {
				if item.Title == consume.Msg.ItemID && remainingToRemove > 0 {
					remainingToRemove--
					continue
				}
				newItems = append(newItems, item)
			}

			inventory.Items = newItems
			if err := cardinal.SetComponent(world, ownerID, inventory); err != nil {
				return msg.ConsumeItemResult{Success: false}, err
			}

			return msg.ConsumeItemResult{
				Success:  true,
				Quantity: itemCount - consume.Msg.Amount,
			}, nil
		})
}
