package query

import (
	comp "metamon/component"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/filter"
	"pkg.world.dev/world-engine/cardinal/types"
)

type OwnerPetsRequest struct {
	Owner comp.Owner `json:"owner"`
}

type OwnerPetsResponse struct {
	PetIDs []types.EntityID `json:"petIds"`
}

func OwnerPets(world cardinal.WorldContext, req *OwnerPetsRequest) (*OwnerPetsResponse, error) {
	var petIDs []types.EntityID

	err := cardinal.NewSearch().Entity(
		filter.Exact(filter.Component[comp.Pet]())).
		Each(world, func(id types.EntityID) bool {
			pet, err := cardinal.GetComponent[comp.Pet](world, id)
			if err != nil {
				return true
			}
			if pet.Owner == req.Owner {
				petIDs = append(petIDs, id)
			}
			return true
		})

	if err != nil {
		return nil, err
	}

	return &OwnerPetsResponse{PetIDs: petIDs}, nil
}
