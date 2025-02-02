package component

// DNA represents genetic traits that influence pet behavior and appearance
type DNA struct {
	Genes      uint64 `json:"genes"`
	Generation uint16 `json:"generation"`
	Species    string `json:"species"`
	Rarity     string `json:"rarity"`
}

// Pet represents the main pet component
type Pet struct {
	DNA       DNA       `json:"dna"`
	Stats     Stats     `json:"stats"`
	State     State     `json:"state"`
	Evolution Evolution `json:"evolution"`
	Owner     Owner     `json:"owner"`
}

// Stats tracks pet attributes
type Stats struct {
	Strength     uint8 `json:"strength"`
	Intelligence uint8 `json:"intelligence"`
	Agility      uint8 `json:"agility"`
	Charm        uint8 `json:"charm"`
}

// State tracks pet's current condition
type State struct {
	Health      int   `json:"health"`
	Hunger      int   `json:"hunger"`
	Happiness   int   `json:"happiness"`
	Hygiene     int   `json:"hygiene"`
	Energy      int   `json:"energy"`
	Age         int   `json:"age"`
	LastFed     int64 `json:"lastFed"`
	LastCleaned int64 `json:"lastCleaned"`
}

// Evolution tracks pet growth stages
type Evolution struct {
	Stage       uint8  `json:"stage"`
	Experience  uint32 `json:"experience"`
	NextStageAt uint32 `json:"nextStageAt"`
}

func (Pet) Name() string {
	return "Pet"
}

func (DNA) Name() string {
	return "PetDNA"
}

func (Stats) Name() string {
	return "PetStats"
}

func (State) Name() string {
	return "PetState"
}

func (Evolution) Name() string {
	return "PetEvolution"
}
