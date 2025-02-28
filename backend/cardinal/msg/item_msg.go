package msg

import (
	comp "metamon/component"
)

type PurchaseItemMsg struct {
	Owner       string  `json:"owner"`
	Title       string  `json:"name"`
	Type        string  `json:"type"`
	Description string  `json:"description"`
	Image       string  `json:"image"`
	Price       float64 `json:"price"`
	Amount      uint32  `json:"amount"`
}

type PurchaseItemResult struct {
	Success bool          `json:"success"`
	Balance uint64        `json:"balance"`
	Item    comp.ShopItem `json:"item"`
}

type ConsumeItemMsg struct {
	Owner  string `json:"owner"`
	Title  string `json:"name"`
	Type   string `json:"type"`
	Amount uint32 `json:"amount"`
}

type ConsumeItemResult struct {
	Success  bool          `json:"success"`
	Quantity uint32        `json:"quantity"`
	Item     comp.ShopItem `json:"item"`
}
