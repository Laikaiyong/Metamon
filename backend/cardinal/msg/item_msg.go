package msg

// PurchaseItemMsg represents a request to purchase an item from shop
type PurchaseItemMsg struct {
	Owner  string `json:"owner"`
	ItemID string `json:"itemId"`
	Amount uint32 `json:"amount"`
}

// PurchaseItemResult represents the result of a purchase attempt
type PurchaseItemResult struct {
	Success bool   `json:"success"`
	Balance uint64 `json:"balance"` // remaining balance after purchase
}

// ConsumeItemMsg represents a request to use/consume an item
type ConsumeItemMsg struct {
	Owner  string `json:"owner"`
	ItemID string `json:"itemId"`
	Amount uint32 `json:"amount"`
}

// ConsumeItemResult represents the result of item consumption
type ConsumeItemResult struct {
	Success  bool   `json:"success"`
	Quantity uint32 `json:"quantity"` // remaining quantity after consumption
}
