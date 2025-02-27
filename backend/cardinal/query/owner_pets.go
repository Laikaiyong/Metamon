package query

import (
	"log"
	comp "metamon/component"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/filter"
	"pkg.world.dev/world-engine/cardinal/types"
)

type OwnerPetsRequest struct {
	Address string `json:"owner"`
}

type OwnerPetsResponse struct {
	Pets   []comp.Pet       `json:"pets"`
	PetsId []types.EntityID `json:"petsId"`
}

func OwnerPets(world cardinal.WorldContext, req *OwnerPetsRequest) (*OwnerPetsResponse, error) {
	var pets []comp.Pet
	var petsId []types.EntityID

	log.Printf("OwnerPets: Searching for pets with owner address: %s", req.Address)

	count := 0
	err := cardinal.NewSearch().Entity(
		filter.Exact(filter.Component[comp.Pet]())).
		Each(world, func(id types.EntityID) bool {
			count++
			pet, err := cardinal.GetComponent[comp.Pet](world, id)
			if err != nil {
				log.Printf("Error getting pet component for ID %v: %v", id, err)
				return true
			}

			// Debug: Log pet details
			log.Printf("Found pet ID %v with owner address: %v", id, pet.Owner.Address)

			if pet.Owner.Address == req.Address {
				log.Printf("Match found! Adding pet ID %v to results", id)
				pets = append(pets, *pet)
				petsId = append(petsId, id)
			}
			return true
		})

	if err != nil {
		log.Printf("Search error: %v", err)
		return nil, err
	}

	// Debug: Log results
	log.Printf("Search complete. Processed %d pets, found %d matches", count, len(pets))

	return &OwnerPetsResponse{Pets: pets, PetsId: petsId}, nil
}
