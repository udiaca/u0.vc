#!/usr/bin/env python3
# Proboscidea Volcanium
# https://adventofcode.com/2022/day/16

from functools import lru_cache
from os import path
import re


def read_and_parse_input():
    # read input file into memory
    script_dir = path.dirname(path.abspath(__file__))
    # input_path = path.join(script_dir, "input.txt")
    input_path = path.join(script_dir, "example.txt")

    with open(input_path) as file:
        data_lines = file.readlines()

    valve_graph = {}
    flow_rates = {}
    p = re.compile(
        "Valve (?P<valve_id>\w+) has flow rate=(?P<flow_rate>\d+); tunnel\w? lead\w? to valve\w? (?P<valve_outs>.*)"
    )
    for data_line in data_lines:
        data_line = data_line.strip()
        valve_id, flow_rate, valve_outs = p.match(data_line).groups()
        flow_rate = int(flow_rate)
        valve_outs = valve_outs.split(", ")
        valve_graph[valve_id] = valve_outs
        flow_rates[valve_id] = flow_rate

    return valve_graph, flow_rates


def score(flow_rates, chosen_valves):
    score = 0
    for valve_id, time_left in chosen_valves:
        score += flow_rates[valve_id] * time_left
    return score


def main():
    valve_graph, flow_rates = read_and_parse_input()

    current_valve_id = "AA"
    assert current_valve_id in valve_graph
    assert current_valve_id in flow_rates

    # nested functions
    def get_options(valve_id, chosen_valves):
        options = [("move", next_valve_id) for next_valve_id in valve_graph[valve_id]]

        chosen_valve_ids = [chosen_valve[0] for chosen_valve in chosen_valves]
        if valve_id not in chosen_valve_ids:
            options.append(("open", valve_id))
        return tuple(options)

    @lru_cache(maxsize=None)
    def eval_choice(valve_id, chosen_valves=(), time_remaining=30):
        print(valve_id, chosen_valves, time_remaining)
        time_remaining = time_remaining - 1

        if time_remaining <= 0:
            return chosen_valves

        options = get_options(valve_id, chosen_valves)

        resolved_choices = []
        for option in options:
            action, next_valve_id = option
            if action == "open":
                chosen_valves = list(chosen_valves)
                chosen_valves.append((next_valve_id, time_remaining))
                chosen_valves = tuple(chosen_valves)
            resolved_choices.append(eval_choice(next_valve_id, chosen_valves, time_remaining))

        best_choice_idx = None
        max_score = None
        for choice_idx, choice in enumerate(resolved_choices):
            cur_score = score(flow_rates, choice)
            if max_score is None or cur_score > max_score:
                max_score = cur_score
                best_choice_idx = choice_idx

        return resolved_choices[best_choice_idx]

    start_time = 30
    print(eval_choice(current_valve_id, (), start_time))

    print(score(flow_rates, {"AA": 30}))


if __name__ == "__main__":
    main()
