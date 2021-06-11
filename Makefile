#!/usr/bin/env -S make -f
# Usage:
# make        # compile all binary

.PHONY = all

TESTDIR := $(CURDIR)/tests
TESTRUN := $(TESTDIR)/run
EXECUTABLE := $(CURDIR)/bin/run

all: generate_files


generate_files:
	@yarn install
	@yarn build
	@echo "Creating link..."
	@echo $(EXECUTABLE)
	@ln $(EXECUTABLE) pcfg_tool
	@echo "Link created. Now you can run your commands using the pcfg_tool command 😎"
	@echo "E.g. pcfg_tool create"








