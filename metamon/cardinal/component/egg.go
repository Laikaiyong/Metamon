package component

type Egg struct {
	DNA         DNA   `json:"dna"`
	HatchTime   int64 `json:"hatch_time"`
	IncubatedAt int64 `json:"incubated_at"`
	Owner       Owner `json:"owner"`
}

func (Egg) Name() string {
	return "PetEgg"
}
