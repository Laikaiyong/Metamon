package system

import (
	"crypto/rand"
	"encoding/binary"
	comp "metamon/component"
	"metamon/msg"

	"pkg.world.dev/world-engine/cardinal"
	"pkg.world.dev/world-engine/cardinal/filter"
	"pkg.world.dev/world-engine/cardinal/types"
)

type GachaPool struct {
	Tier      string
	Species   []string
	BaseStats comp.Stats
	RateBonus float32
}

var GachaPools = map[string]GachaPool{
	"common": {
		Tier:    "common",
		Species: []string{"neko", "dog", "rabbit"},
		BaseStats: comp.Stats{
			Strength:     5,
			Intelligence: 5,
			Agility:      5,
			Charm:        5,
		},
		RateBonus: 1.0,
	},
	"rare": {
		Tier:    "rare",
		Species: []string{"fox", "wolf", "deer"},
		BaseStats: comp.Stats{
			Strength:     10,
			Intelligence: 10,
			Agility:      10,
			Charm:        10,
		},
		RateBonus: 1.5,
	},
	"epic": {
		Tier:    "epic",
		Species: []string{"dragon", "griffin", "phoenix"},
		BaseStats: comp.Stats{
			Strength:     15,
			Intelligence: 15,
			Agility:      15,
			Charm:        15,
		},
		RateBonus: 2.0,
	},
	"legendary": {
		Tier:    "legendary",
		Species: []string{"unicorn", "golem", "kitsune"},
		BaseStats: comp.Stats{
			Strength:     20,
			Intelligence: 20,
			Agility:      20,
			Charm:        20,
		},
		RateBonus: 2.5,
	},
}

func GachaSpawnerSystem(world cardinal.WorldContext) error {
	// Handle egg creation
	return cardinal.EachMessage[msg.CreateEggMsg, msg.CreateEggResult](
		world,
		func(create cardinal.TxData[msg.CreateEggMsg]) (msg.CreateEggResult, error) {
			pool, exists := GachaPools[create.Msg.Tier]
			if !exists {
				return msg.CreateEggResult{Success: false}, nil
			}

			var owner comp.Owner

			err := cardinal.NewSearch().Entity(
				filter.Exact(filter.Component[comp.Owner]())).
				Each(world, func(id types.EntityID) bool {
					o, err := cardinal.GetComponent[comp.Owner](world, id)
					if err != nil {
						return true
					}
					if o.Address == create.Msg.Owner {
						owner = *o
						return false
					}
					return true
				})

			if err != nil {
				return msg.CreateEggResult{
					Success: false,
				}, err
			}
			dna, err := generateDNA(pool)
			if err != nil {
				return msg.CreateEggResult{Success: false}, err
			}

			egg := comp.Pet{
				DNA:   dna,
				Stats: GachaPools[dna.Rarity].BaseStats,
				State: comp.State{
					Health:    100,
					Hunger:    100,
					Happiness: 100,
					Hygiene:   100,
					Energy:    100,
					Age:       0,
				},
				Evolution: comp.Evolution{
					Stage:       1,
					Experience:  0,
					NextStageAt: 100,
				},
				Owner: owner,
			}

			id, err := cardinal.Create(world, egg)
			if err != nil {
				return msg.CreateEggResult{Success: false}, err
			}

			return msg.CreateEggResult{
				Success: true,
				EggID:   id,
				DNA:     dna,
			}, nil
		})
}

func generateDNA(pool GachaPool) (comp.DNA, error) {
	var randomBytes [8]byte
	if _, err := rand.Read(randomBytes[:]); err != nil {
		return comp.DNA{}, err
	}

	genes := binary.BigEndian.Uint64(randomBytes[:])
	species := pool.Species[genes%uint64(len(pool.Species))]

	return comp.DNA{
		Genes:      genes,
		Generation: 1,
		Species:    species,
		Rarity:     pool.Tier,
	}, nil
}
