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
		cardinal.RegisterComponent[component.Egg](w),
	)

	// Register messages
	Must(
		cardinal.RegisterMessage[msg.CreateOwnerMsg, msg.CreateOwnerResult](w, "create-owner"),
		cardinal.RegisterMessage[msg.CarePetMsg, msg.CarePetResult](w, "care-pet"),
		cardinal.RegisterMessage[msg.EvolveMsg, msg.EvolveResult](w, "evolve-pet"),
		cardinal.RegisterMessage[msg.CreateEggMsg, msg.CreateEggResult](w, "create-egg"),
		cardinal.RegisterMessage[msg.HatchEggMsg, msg.HatchEggResult](w, "hatch-egg"),
	)

	// Register queries
	Must(
		cardinal.RegisterQuery[query.PetInfoRequest, query.PetInfoResponse](w, "pet-info", query.PetInfo),
		cardinal.RegisterQuery[query.OwnerRequest, query.OwnerResponse](w, "owner-info", query.QueryOwner),
		cardinal.RegisterQuery[query.OwnerPetsRequest, query.OwnerPetsResponse](w, "owner-pets", query.OwnerPets),
	)

	// Register systems
	Must(cardinal.RegisterSystems(w,
		system.GachaSystem,
		system.GachaSpawnerSystem,
		system.HatchGachaSystem,
		system.OwnerSystem,
		system.OwnerSpawnerSystem,
		system.PetLifecycleSystem,
		system.EvolutionSystem,
		system.PetCareSystem,
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
