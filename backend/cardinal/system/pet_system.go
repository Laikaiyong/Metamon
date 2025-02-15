package system

import (
	comp "metamon/component"
	"metamon/msg"
	"time"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/filter"
	"pkg.world.dev/world-engine/cardinal/types"
)

const (
	MaxHunger    = 100
	MaxHappiness = 100
	MaxHygiene   = 100
	MaxEnergy    = 100
)

const (
	FeedBonus         = 25
	PlayBonus         = 20
	CleanBonus        = 30
	ExperiencePerCare = 10
)

var EvolutionThresholds = map[uint8]uint32{
	1: 1000,
	2: 6000,
	3: 10000,
}

func CheckEvolution(world cardinal.WorldContext, message msg.EvolveMsg) (msg.EvolveResult, error) {
	pet, err := cardinal.GetComponent[comp.Pet](world, message.PetID)
	if err != nil {
		return msg.EvolveResult{
			Success: false,
		}, err
	}

	currentStage := pet.Evolution.Stage
	threshold := EvolutionThresholds[currentStage]

	if pet.Evolution.Experience >= threshold {
		pet.Evolution.Stage++
		pet.Evolution.NextStageAt = EvolutionThresholds[pet.Evolution.Stage]

		// Boost stats on evolution
		pet.Stats.Strength += 5
		pet.Stats.Intelligence += 5
		pet.Stats.Agility += 5
		pet.Stats.Charm += 5

		if err := cardinal.SetComponent[comp.Pet](world, message.PetID, pet); err != nil {
			return msg.EvolveResult{
				Success: false,
			}, err
		}

		return msg.EvolveResult{
			Success:  true,
			NewStage: pet.Evolution.Stage,
		}, nil
	}

	return msg.EvolveResult{Success: false}, nil
}

func EvolutionSystem(world cardinal.WorldContext) error {
	return cardinal.EachMessage[msg.EvolveMsg, msg.EvolveResult](
		world,
		func(evolve cardinal.TxData[msg.EvolveMsg]) (msg.EvolveResult, error) {
			return CheckEvolution(world, evolve.Msg)
		})
}

func PetCareSystem(world cardinal.WorldContext) error {
	return cardinal.EachMessage[msg.CarePetMsg, msg.CarePetResult](
		world,
		func(care cardinal.TxData[msg.CarePetMsg]) (msg.CarePetResult, error) {
			pet, err := cardinal.GetComponent[comp.Pet](world, care.Msg.PetID)
			if err != nil {
				return msg.CarePetResult{Success: false}, err
			}

			switch care.Msg.Action {
			case "feed":
				pet.State.Hunger = min(MaxHunger, pet.State.Hunger+FeedBonus)
				pet.State.LastFed = time.Now().Unix()
			case "play":
				pet.State.Happiness = min(MaxHappiness, pet.State.Happiness+PlayBonus)
				pet.State.Energy -= 10
			case "clean":
				pet.State.Hygiene = min(MaxHygiene, pet.State.Hygiene+CleanBonus)
				pet.State.LastCleaned = time.Now().Unix()
			}

			pet.Evolution.Experience += ExperiencePerCare

			if err := cardinal.SetComponent[comp.Pet](world, care.Msg.PetID, pet); err != nil {
				return msg.CarePetResult{Success: false}, err
			}

			return msg.CarePetResult{
				Success:  true,
				NewState: pet.State,
			}, nil
		})
}

// PetLifecycleSystem handles pet state updates each tick
func PetLifecycleSystem(world cardinal.WorldContext) error {
	return cardinal.NewSearch().Entity(
		filter.Exact(filter.Component[comp.Pet]())).
		Each(world, func(id types.EntityID) bool {
			pet, err := cardinal.GetComponent[comp.Pet](world, id)
			if err != nil {
				return true
			}

			// Update pet state
			updatePetState(&pet.State)

			// Check evolution conditions
			_, err = CheckEvolution(world, msg.EvolveMsg{PetID: id})

			if err != nil {
				return true
			}
			return true
		})
}

func updatePetState(state *comp.State) {
	state.Hunger = max(0, state.Hunger-1)
	state.Energy = max(0, state.Energy-1)
	state.Hygiene = max(0, state.Hygiene-1)
	state.Age++
}
