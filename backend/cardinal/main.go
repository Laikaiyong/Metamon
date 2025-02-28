package main

import (
	"errors"

	"github.com/rs/zerolog/log"
	"pkg.world.dev/world-engine/cardinal"

	"metamon/component"
	"metamon/msg"
	"metamon/query"
	"metamon/system"
)

func main() {
	w, err := cardinal.NewWorld(cardinal.WithDisableSignatureVerification())
	if err != nil {
		log.Fatal().Err(err).Msg("")
	}

	MustInitWorld(w)

	Must(w.StartGame())
}

// MustInitWorld registers all components, messages, queries, and systems. This initialization happens in a helper
// function so that this can be used directly in tests.
func MustInitWorld(w *cardinal.World) {
	// Register components
	Must(
		cardinal.RegisterComponent[component.Pet](w),
		cardinal.RegisterComponent[component.Owner](w),
		cardinal.RegisterComponent[component.ShopItem](w),
		cardinal.RegisterComponent[component.OwnerShopItem](w),
	)

	// Register messages
	Must(
		cardinal.RegisterMessage[msg.CreateOwnerMsg, msg.CreateOwnerResult](w, "createowner"),
		cardinal.RegisterMessage[msg.GetOwnerMsg, msg.GetOwnerResult](w, "getowner"),
		cardinal.RegisterMessage[msg.CarePetMsg, msg.CarePetResult](w, "carepet"),
		cardinal.RegisterMessage[msg.EvolveMsg, msg.EvolveResult](w, "evolvepet"),
		cardinal.RegisterMessage[msg.CreateEggMsg, msg.CreateEggResult](w, "createegg"),
		cardinal.RegisterMessage[msg.PurchaseItemMsg, msg.PurchaseItemResult](w, "purchaseitem"),
		cardinal.RegisterMessage[msg.ConsumeItemMsg, msg.ConsumeItemResult](w, "consumeitem"),
		cardinal.RegisterMessage[msg.UpdateBalanceMsg, msg.UpdateBalanceResult](w, "updatebalance"),
		cardinal.RegisterMessage[msg.PassiveDecayMsg, msg.PassiveDecayResult](w, "passivedecay"),
	)

	// Register queries
	Must(
		cardinal.RegisterQuery[query.PetInfoRequest, query.PetInfoResponse](w, "petinfo", query.PetInfo),
		cardinal.RegisterQuery[query.OwnerRequest, query.OwnerResponse](w, "ownerinfo", query.QueryOwner),
		cardinal.RegisterQuery[query.OwnerPetsRequest, query.OwnerPetsResponse](w, "ownerpets", query.OwnerPets),
		cardinal.RegisterQuery[query.OwnerItemsRequest, query.OwnerItemsResponse](w, "owneritems", query.OwnerItems),
	)

	// Register systems
	Must(cardinal.RegisterSystems(w,
		system.GachaSpawnerSystem,
		system.OwnerSystem,
		system.OwnerSpawnerSystem,
		system.PetLifecycleSystem,
		system.EvolutionSystem,
		system.PetCareSystem,
		system.ConsumeItemSystem,
		system.PurchaseItemSystem,
		system.BalanceSystem,
		system.PassiveDecaySystem,
	))

	// Must(cardinal.RegisterInitSystems(w,
	//     system.SpawnDefaultPlayersSystem,
	// ))
}
func Must(err ...error) {
	e := errors.Join(err...)
	if e != nil {
		log.Fatal().Err(e).Msg("")
	}
}
