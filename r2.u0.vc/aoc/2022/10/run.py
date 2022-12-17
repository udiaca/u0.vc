#!/usr/bin/env python3
# Cathode-Ray Tube
# https://adventofcode.com/2022/day/10

from queue import Queue
from os import path


def read_and_parse_input():
    # Read input file into memory
    script_dir = path.dirname(path.abspath(__file__))
    input_path = path.join(script_dir, "input.txt")
    # input_path = path.join(script_dir, "example.txt")
    # input_path = path.join(script_dir, "exampleB.txt")
    with open(input_path) as file:
        data_lines = file.readlines()

    # Parse file into workable input
    deltas = []
    for data_line in data_lines:
        data_line = data_line.strip()
        if not data_line:
            continue

        prefix_addx = "addx "
        prefix_noop = "noop"

        if data_line.startswith(prefix_addx):
            deltas.append(int(data_line[len(prefix_addx) :]))
        elif data_line.startswith(prefix_noop):
            deltas.append(0)  # no-op
        else:
            raise ValueError(data_line)
    return deltas


def main():
    deltas = read_and_parse_input()

    cycle_idx = 1
    x = 1
    inst_queue = Queue()
    signal_strengths = {}

    while True:
        # during cycle
        delta = 0
        if cycle_idx <= len(deltas):
            # still in instructions, defer cycles
            delta = deltas[cycle_idx - 1]
            if delta == 0:
                inst_queue.put(None)
            else:
                inst_queue.put(None)
                inst_queue.put(delta)

        print(f"cycle: {cycle_idx}, x: {x}, delta: {delta}, inst_queue_size: {inst_queue.qsize()}")
        if (cycle_idx - 20) % 40 == 0:
            signal_strengths[cycle_idx] = cycle_idx * x

        # after cycle
        if inst_queue.empty():
            continue
        apply_addx = inst_queue.get()
        if apply_addx is not None:
            x += apply_addx
            print(f"  after cycle {cycle_idx}, change x by {apply_addx} to become {x}")
        inst_queue.task_done()
        cycle_idx += 1

        if inst_queue.empty() and cycle_idx >= len(deltas):
            break

    print(signal_strengths)
    print(sum(signal_strengths.values()))


if __name__ == "__main__":
    main()
