package query

import (
	comp "metamon/component"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/filter"
	"pkg.world.dev/world-engine/cardinal/types"
)

type OwnerRequest struct {
	Address string `json:"address"`
}

type OwnerResponse struct {
	OwnerID types.EntityID `json:"ownerId"`
	Owner   comp.Owner     `json:"owner"`
}

func QueryOwner(world cardinal.WorldContext, req *OwnerRequest) (*OwnerResponse, error) {
	var ownerID types.EntityID
	var owner comp.Owner

	err := cardinal.NewSearch().Entity(
		filter.Exact(filter.Component[comp.Owner]())).
		Each(world, func(id types.EntityID) bool {
			o, err := cardinal.GetComponent[comp.Owner](world, id)
			if err != nil {
				return true
			}
			if o.Address == req.Address {
				ownerID = id
				owner = *o
				return false
			}
			return true
		})

	if err != nil {
		return nil, err
	}

	return &OwnerResponse{
		OwnerID: ownerID,
		Owner:   owner,
	}, nil
}
