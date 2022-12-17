#!/usr/bin/env python3
# Proboscidea Volcanium
# https://adventofcode.com/2022/day/16

from os import path
import re


def read_and_parse_input():
    # read input file into memory
    script_dir = path.dirname(path.abspath(__file__))
    # input_path = path.join(script_dir, "input.txt")
    input_path = path.join(script_dir, "example.txt")

    with open(input_path) as file:
        data_lines = file.readlines()

    valves = {}
    p = re.compile(
        "Valve (?P<valve_id>\w+) has flow rate=(?P<flow_rate>\d+); tunnel\w? lead\w? to valve\w? (?P<valve_outs>.*)"
    )
    for data_line in data_lines:
        data_line = data_line.strip()
        valve_id, flow_rate, valve_outs = p.match(data_line).groups()
        flow_rate = int(flow_rate)
        valve_outs = valve_outs.split(", ")
        valves[valve_id] = {
            "flow_rate": flow_rate,
            "valve_outs": valve_outs,
        }

    return valves


def main():
    data = read_and_parse_input()

    for k, v in data.items():
        print(k, v)


if __name__ == "__main__":
    main()
