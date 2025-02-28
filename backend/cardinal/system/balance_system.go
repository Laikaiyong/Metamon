package system

import (
	"metamon/component"
	"metamon/msg"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/filter"
	"pkg.world.dev/world-engine/cardinal/types"
)

func BalanceSystem(world cardinal.WorldContext) error {
	return cardinal.EachMessage[msg.UpdateBalanceMsg, msg.UpdateBalanceResult](
		world,
		func(update cardinal.TxData[msg.UpdateBalanceMsg]) (msg.UpdateBalanceResult, error) {
			// Find owner by address
			var ownerID types.EntityID
			err := cardinal.NewSearch().Entity(
				filter.Exact(filter.Component[component.Owner]())).
				Each(world, func(id types.EntityID) bool {
					owner, err := cardinal.GetComponent[component.Owner](world, id)
					if err != nil {
						return true
					}
					if owner.Address == update.Msg.OwnerAddress {
						ownerID = id
						return false
					}
					return true
				})
			if err != nil {
				return msg.UpdateBalanceResult{Success: false}, err
			}

			// Update owner balance
			owner, err := cardinal.GetComponent[component.Owner](world, ownerID)
			if err != nil {
				return msg.UpdateBalanceResult{Success: false}, err
			}

			owner.Balance += update.Msg.Amount
			if owner.Balance < 0 {
				return msg.UpdateBalanceResult{Success: false}, err
			}

			if err := cardinal.SetComponent(world, ownerID, owner); err != nil {
				return msg.UpdateBalanceResult{Success: false}, err
			}

			return msg.UpdateBalanceResult{
				Success:    true,
				NewBalance: owner.Balance,
			}, nil
		})
}
