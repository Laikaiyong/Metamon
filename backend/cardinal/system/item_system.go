package system

import (
	"metamon/component"
	"metamon/msg"

	"pkg.world.dev/world-engine/cardinal"
)

func PurchaseItemSystem(world cardinal.WorldContext) error {
	return cardinal.EachMessage[msg.PurchaseItemMsg, msg.PurchaseItemResult](
		world,
		func(purchase cardinal.TxData[msg.PurchaseItemMsg]) (msg.PurchaseItemResult, error) {
			// Get user's wallet
			wallet, err := cardinal.GetComponent[component.Wallet](world, purchase.Msg.Owner)
			if err != nil {
				return msg.PurchaseItemResult{Success: false}, err
			}

			// Get shop item
			item, err := cardinal.GetComponent[component.ShopItem](world, purchase.Msg.ItemID)
			if err != nil {
				return msg.PurchaseItemResult{Success: false}, err
			}

			// Calculate total cost
			totalCost := item.Price * float64(purchase.Msg.Amount)

			// Check if user has enough balance
			if float64(wallet.Balance) < totalCost {
				return msg.PurchaseItemResult{
					Success: false,
					Balance: wallet.Balance,
				}, nil
			}

			// Update user's wallet
			wallet.Balance -= uint64(totalCost)
			if err := cardinal.SetComponent(world, purchase.Msg.Owner, wallet); err != nil {
				return msg.PurchaseItemResult{Success: false}, err
			}

			// Add items to user's inventory
			inventory, err := cardinal.GetComponent[component.OwnerShopItem](world, purchase.Msg.Owner)
			if err != nil {
				inventory = component.OwnerShopItem{
					Owner: purchase.Msg.Owner,
					Items: []component.ShopItem{},
				}
			}

			// Add purchased items
			for i := uint32(0); i < purchase.Msg.Amount; i++ {
				inventory.Items = append(inventory.Items, *item)
			}

			if err := cardinal.SetComponent(world, purchase.Msg.Owner, inventory); err != nil {
				return msg.PurchaseItemResult{Success: false}, err
			}

			return msg.PurchaseItemResult{
				Success: true,
				Balance: wallet.Balance,
			}, nil
		})
}

func ConsumeItemSystem(world cardinal.WorldContext) error {
	return cardinal.EachMessage[msg.ConsumeItemMsg, msg.ConsumeItemResult](
		world,
		func(consume cardinal.TxData[msg.ConsumeItemMsg]) (msg.ConsumeItemResult, error) {
			// Get user's inventory
			inventory, err := cardinal.GetComponent[component.OwnerShopItem](world, consume.Msg.Owner)
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
			if err := cardinal.SetComponent(world, consume.Msg.Owner, inventory); err != nil {
				return msg.ConsumeItemResult{Success: false}, err
			}

			return msg.ConsumeItemResult{
				Success:  true,
				Quantity: itemCount - consume.Msg.Amount,
			}, nil
		})
}
