package main

import (
	"flag"
	"fmt"

	"github.com/apex/log"
	"github.com/bassosimone/2023-12-09-ooni-javascript/internal/dsljavascript"
	"github.com/ooni/probe-engine/pkg/runtimex"
)

func main() {
	/*
		fp := runtimex.Try1(os.Create("jsconsole.pprof"))
		pprof.StartCPUProfile(fp)
		defer pprof.StopCPUProfile()
	*/

	mflag := flag.Bool("m", false, "run the script as a module containing an experiment")
	flag.Parse()

	config := &dsljavascript.VMConfig{
		Logger:        log.Log,
		ScriptBaseDir: "./javascript",
	}

	if *mflag {
		vm := runtimex.Try1(dsljavascript.LoadExperiment(config, flag.Arg(0)))

		experimentName := runtimex.Try1(vm.ExperimentName())
		fmt.Printf("\"%s\"\n", experimentName)

		experimentVersion := runtimex.Try1(vm.ExperimentVersion())
		fmt.Printf("\"%s\"\n", experimentVersion)

		testKeys := runtimex.Try1(vm.Run("{}"))
		fmt.Printf("%s\n", testKeys)
		return
	}

	runtimex.Try0(dsljavascript.RunScript(config, flag.Arg(0)))
}
