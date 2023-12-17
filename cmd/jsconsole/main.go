package main

import (
	"flag"
	"fmt"

	"github.com/apex/log"
	"github.com/ooni/probe-engine/pkg/must"
	"github.com/ooni/probe-engine/pkg/runtimex"
	"github.com/ooni/probe-engine/pkg/x/dsljavascript"
)

func maybeReadRicherInput(fpath string) string {
	// if there's no file to read from, just return an empty string
	if fpath == "" {
		return ""
	}

	// otherwise attempt to read the file
	data := must.ReadFile(fpath)
	return string(data)
}

func main() {
	/*
		fp := runtimex.Try1(os.Create("jsconsole.pprof"))
		pprof.StartCPUProfile(fp)
		defer pprof.StopCPUProfile()
	*/

	fflag := flag.String("f", "", "optional file from which to read richer input when running in -m mode")
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

		testKeys := runtimex.Try1(vm.Run(maybeReadRicherInput(*fflag)))
		fmt.Printf("%s\n", testKeys)
		return
	}

	runtimex.Try0(dsljavascript.RunScript(config, flag.Arg(0)))
}
