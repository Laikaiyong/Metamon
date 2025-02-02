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
