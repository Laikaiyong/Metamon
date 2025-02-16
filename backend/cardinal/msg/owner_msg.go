package msg

import "pkg.world.dev/world-engine/cardinal/types"

type CreateOwnerMsg struct {
	Address  string `json:"address"`
	Nickname string `json:"nickname"`
}

type CreateOwnerResult struct {
	Success bool           `json:"success"`
	OwnerID types.EntityID `json:"owner_id"`
}

type GetOwnerMsg struct {
	Address string `json:"address"`
}

type GetOwnerResult struct {
	Success     bool           `json:"success"`
	OwnerID     types.EntityID `json:"owner_id"`
	Address     string         `json:"address"`
	Nickname    string         `json:"nickname"`
	JoinedAt    int64          `json:"joined_at"`
	PetCount    int            `json:"pet_count"`
	LastPetTime int64          `json:"last_pet_time"`
}
