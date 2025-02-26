package component

type Owner struct {
	Address     string `json:"address"`
	Nickname    string `json:"nickname"`
	JoinedAt    int64  `json:"joined_at"`
	PetCount    int    `json:"pet_count"`
	LastPetTime int64  `json:"last_pet_time"`
	Balance     int64  `json:"balance"`
}

func (Owner) Name() string {
	return "Owner"
}
