package system

import (
	"fmt"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/types"

	comp "metamon/component"
)

func queryPet(world cardinal.WorldContext, petID types.EntityID) (*comp.Pet, error) {
	pet, err := cardinal.GetComponent[comp.Pet](world, petID)
	if err != nil {
		return nil, fmt.Errorf("failed to get pet: %v", err)
	}
	return pet, nil
}

func queryEgg(world cardinal.WorldContext, eggID types.EntityID) (*comp.Egg, error) {
	egg, err := cardinal.GetComponent[comp.Egg](world, eggID)
	if err != nil {
		return nil, fmt.Errorf("failed to get egg: %v", err)
	}
	return egg, nil
}

func verifyPetOwner(world cardinal.WorldContext, petID types.EntityID, owner string) error {
	pet, err := queryPet(world, petID)
	if err != nil {
		return err
	}
	if pet.Owner.Address != owner {
		return fmt.Errorf("not pet owner")
	}
	return nil
}
