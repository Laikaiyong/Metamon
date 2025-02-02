package msg

import (
	"pkg.world.dev/world-engine/cardinal/types"

	comp "metamon/component"
)

type CarePetMsg struct {
	PetID  types.EntityID `json:"petId"`
	Action string         `json:"action"` // "feed", "clean", "play"
	ItemID string         `json:"itemId"` // optional item used
}

type CarePetResult struct {
	Success  bool       `json:"success"`
	NewState comp.State `json:"newState"`
}

type EvolveMsg struct {
	PetID types.EntityID `json:"petId"`
}

type EvolveResult struct {
	Success  bool  `json:"success"`
	NewStage uint8 `json:"newStage"`
}

type CreateEggMsg struct {
	Owner string `json:"owner"`
	Tier  string `json:"tier"` // "common", "rare", "epic", "legendary"
}

type CreateEggResult struct {
	Success bool           `json:"success"`
	EggID   types.EntityID `json:"eggId"`
	DNA     comp.DNA       `json:"dna"`
}

type HatchEggMsg struct {
	EggID types.EntityID `json:"eggId"`
}

type HatchEggResult struct {
	Success bool           `json:"success"`
	PetID   types.EntityID `json:"petId"`
}
