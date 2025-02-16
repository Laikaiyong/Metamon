package system

import (
	comp "metamon/component"
	"metamon/msg"
	"time"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/filter"
	"pkg.world.dev/world-engine/cardinal/types"
)

func OwnerSystem(world cardinal.WorldContext) error {
	// Update owner stats
	return cardinal.NewSearch().Entity(
		filter.Exact(filter.Component[comp.Owner]())).
		Each(world, func(id types.EntityID) bool {
			owner, err := cardinal.GetComponent[comp.Owner](world, id)
			if err != nil {
				return true
			}

			// Count pets owned
			petCount := 0
			err = cardinal.NewSearch().Entity(
				filter.Exact(filter.Component[comp.Pet]())).
				Each(world, func(petID types.EntityID) bool {
					pet, err := cardinal.GetComponent[comp.Pet](world, petID)
					if err != nil {
						return true
					}
					if pet.Owner.Address == owner.Address {
						petCount++
					}
					return true
				})

			if err != nil {
				return true
			}

			// Update owner stats
			owner.PetCount = petCount
			if err := cardinal.SetComponent(world, id, owner); err != nil {
				return true
			}

			return true
		})
}

func OwnerSpawnerSystem(world cardinal.WorldContext) error {
	return cardinal.EachMessage[msg.CreateOwnerMsg, msg.CreateOwnerResult](
		world,
		func(create cardinal.TxData[msg.CreateOwnerMsg]) (msg.CreateOwnerResult, error) {
			owner := comp.Owner{
				Address:     create.Msg.Address,
				Nickname:    create.Msg.Nickname,
				JoinedAt:    time.Now().Unix(),
				PetCount:    0,
				LastPetTime: 0,
			}

			id, err := cardinal.Create(world, owner)
			if err != nil {
				return msg.CreateOwnerResult{
					Success: false,
				}, err
			}

			err = world.EmitEvent(map[string]any{
				"event":   "new_owner",
				"id":      id,
				"address": create.Msg.Address,
			})
			if err != nil {
				return msg.CreateOwnerResult{Success: false}, err
			}

			return msg.CreateOwnerResult{
				Success: true,
				OwnerID: id,
			}, nil
		})
}

func OwnerGetterSystem(world cardinal.WorldContext) error {
	return cardinal.EachMessage[msg.GetOwnerMsg, msg.GetOwnerResult](
		world,
		func(get cardinal.TxData[msg.GetOwnerMsg]) (msg.GetOwnerResult, error) {
			// Search for owner with matching address
			var foundOwner *comp.Owner
			var foundID types.EntityID

			err := cardinal.NewSearch().Entity(
				filter.Exact(filter.Component[comp.Owner]())).
				Each(world, func(id types.EntityID) bool {
					owner, err := cardinal.GetComponent[comp.Owner](world, id)
					if err != nil {
						return true
					}
					if owner.Address == get.Msg.Address {
						foundOwner = owner
						foundID = id
						return false // Stop searching
					}
					return true
				})

			if err != nil {
				return msg.GetOwnerResult{Success: false}, err
			}

			if foundOwner == nil {
				return msg.GetOwnerResult{Success: false}, nil
			}

			return msg.GetOwnerResult{
				Success:     true,
				OwnerID:     foundID,
				Address:     foundOwner.Address,
				Nickname:    foundOwner.Nickname,
				JoinedAt:    foundOwner.JoinedAt,
				PetCount:    foundOwner.PetCount,
				LastPetTime: foundOwner.LastPetTime,
			}, nil
		})
}
