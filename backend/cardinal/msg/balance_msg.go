package msg

type UpdateBalanceMsg struct {
	OwnerAddress string `json:"owner_address"`
	Amount       int64  `json:"amount"`
}

type UpdateBalanceResult struct {
	Success    bool  `json:"success"`
	NewBalance int64 `json:"new_balance"`
}
