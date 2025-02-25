package query

import (
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
	var items []comp.ShopItem

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
				items = append(items, ownerItem.Items...)
			}
			return true
		})

	if err != nil {
		log.Printf("Search error: %v", err)
		return nil, err
	}

	// Debug: Log results
	log.Printf("Search complete. Processed %d items, found %d matches", count, len(items))

	return &OwnerItemsResponse{Items: items}, nil
}
