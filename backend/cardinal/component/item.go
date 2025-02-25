package component

type ShopItem struct {
	Image       string  `json:"image"`
	Title       string  `json:"name"`
	Type        string  `json:"type"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
}

func (ShopItem) Name() string {
	return "ShopItem"
}

type OwnerShopItem struct {
	Owner string     `json:"owner"`
	Items []ShopItem `json:"items"`
}

func (OwnerShopItem) Name() string {
	return "OwnerShopItem"
}
