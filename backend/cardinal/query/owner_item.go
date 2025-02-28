package query

import (
	"fmt"
	"log"
	comp "metamon/component"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/filter"
	"pkg.world.dev/world-engine/cardinal/types"
)

type OwnerItemsRequest struct {
	Address string `json:"owner"`
}

type OwnerItemsResponse struct {
	Items []comp.ShopItem `json:"items"`
}

func OwnerItems(world cardinal.WorldContext, req *OwnerItemsRequest) (*OwnerItemsResponse, error) {
	// Map to track item quantities: key = "title:type"
	itemMap := make(map[string]*comp.ShopItem)

	log.Printf("OwnerItems: Searching for items with owner address: %s", req.Address)

	count := 0
	err := cardinal.NewSearch().Entity(
		filter.Exact(filter.Component[comp.OwnerShopItem]())).
		Each(world, func(id types.EntityID) bool {
			count++
			ownerItem, err := cardinal.GetComponent[comp.OwnerShopItem](world, id)
			if err != nil {
				log.Printf("Error getting owner shop item component for ID %v: %v", id, err)
				return true
			}

			// Check if this OwnerShopItem belongs to the requested owner
			if ownerItem.Owner == req.Address {
				// Merge items by title and type
				for _, item := range ownerItem.Items {
					key := fmt.Sprintf("%s:%s", item.Title, item.Type)
					if existing, ok := itemMap[key]; ok {
						existing.Quantity++
					} else {
						newItem := item
						newItem.Quantity = 1
						itemMap[key] = &newItem
					}
				}
			}
			return true
		})

	if err != nil {
		log.Printf("Search error: %v", err)
		return nil, err
	}

	// Convert map to slice
	items := make([]comp.ShopItem, 0, len(itemMap))
	for _, item := range itemMap {
		items = append(items, *item)
	}

	log.Printf("Search complete. Processed %d entities, found %d unique items", count, len(items))

	return &OwnerItemsResponse{Items: items}, nil
}
