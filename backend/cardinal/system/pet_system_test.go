package system_test

import(
	"metamon/msg"
	"metamon/system"
	"pkg.world.dev/world-engine/cardinal"
	"testing"
)

func TestCheckEvolution(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for target function.
		world   cardinal.WorldContext
		message msg.EvolveMsg
		want    msg.EvolveResult
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, gotErr := system.CheckEvolution(tt.world, tt.message)
			if gotErr != nil {
				if !tt.wantErr {
					t.Errorf("CheckEvolution() failed: %v", gotErr)
				}
				return
			}
			if tt.wantErr {
				t.Fatal("CheckEvolution() succeeded unexpectedly")
			}
			// TODO: update the condition below to compare got with tt.want.
			if true {
				t.Errorf("CheckEvolution() = %v, want %v", got, tt.want)
			}
		})
	}
}
