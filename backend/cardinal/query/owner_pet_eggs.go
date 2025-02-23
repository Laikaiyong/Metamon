package query

import (
	"log"
	comp "metamon/component"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/filter"
	"pkg.world.dev/world-engine/cardinal/types"
)

type OwnerEggsRequest struct {
	Address string `json:"owner"`
}

type OwnerEggsResponse struct {
	Eggs []comp.Egg `json:"eggs"`
}

func OwnerEggs(world cardinal.WorldContext, req *OwnerEggsRequest) (*OwnerEggsResponse, error) {
	var eggs []comp.Egg

	log.Printf("OwnerEggs: Searching for eggs with owner address: %s", req.Address)

	count := 0
	err := cardinal.NewSearch().Entity(
		filter.Exact(filter.Component[comp.Egg]())).
		Each(world, func(id types.EntityID) bool {
			count++
			egg, err := cardinal.GetComponent[comp.Egg](world, id)
			if err != nil {
				log.Printf("Error getting egg component for ID %v: %v", id, err)
				return true
			}

			log.Printf("Found egg ID %v with owner address: %v", id, egg.Owner.Address)

			if egg.Owner.Address == req.Address {
				log.Printf("Match found! Adding egg ID %v to results", id)
				eggs = append(eggs, *egg)
			}
			return true
		})

	if err != nil {
		log.Printf("Search error: %v", err)
		return nil, err
	}

	log.Printf("Search complete. Processed %d eggs, found %d matches", count, len(eggs))

	return &OwnerEggsResponse{Eggs: eggs}, nil
}
