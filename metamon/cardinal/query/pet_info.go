package query

import (
	"fmt"

	comp "metamon/component"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/types"
)

type PetInfoRequest struct {
	PetID types.EntityID `json:"petId"`
}

type PetInfoResponse struct {
	DNA       comp.DNA       `json:"dna"`
	Stats     comp.Stats     `json:"stats"`
	State     comp.State     `json:"state"`
	Evolution comp.Evolution `json:"evolution"`
}

func PetInfo(world cardinal.WorldContext, req *PetInfoRequest) (*PetInfoResponse, error) {
	pet, err := cardinal.GetComponent[comp.Pet](world, req.PetID)
	if err != nil {
		return nil, fmt.Errorf("pet not found: %v", err)
	}

	return &PetInfoResponse{
		DNA:       pet.DNA,
		Stats:     pet.Stats,
		State:     pet.State,
		Evolution: pet.Evolution,
	}, nil
}
