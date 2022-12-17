#!/usr/bin/env python3
# Rope Bridge
# https://adventofcode.com/2022/day/9

from os import path

def read_and_parse_input():
    # Read input file into memory
    script_dir = path.dirname(path.abspath(__file__))
    input_path = path.join(script_dir, "input.txt")
    # input_path = path.join(script_dir, "example.txt")
    with open(input_path) as file:
        data_lines = file.readlines()

    # Parse file into workable input
    moves = []
    for data_line in data_lines:
        data_line = data_line.strip()
        if not data_line:
            continue
        direction, steps = data_line.split()
        moves.append((direction, int(steps)))
    return moves


def determine_new_position(position, direction):
    """
    Position is (x,y) coordinate. Direction is string ("URDL")
    """
    x, y = position
    if "U" in direction:
        y += 1
    if "R" in direction:
        x += 1
    if "D" in direction:
        y -= 1
    if "L" in direction:
        x -= 1

    return x, y


def is_adjacent(pos_a, pos_b):
    deltas = tuple(val[0] - val[1] for val in zip(pos_a, pos_b))
    for delta in deltas:
        if delta != 0 and abs(delta) > 1:
            return False
    return True


def determine_new_direction(pos_a, pos_b):
    deltas = (val[0] - val[1] for val in zip(pos_a, pos_b))
    x_delta, y_delta = deltas

    new_direction = []
    if x_delta > 0:
        new_direction.append("R")
    elif x_delta < 0:
        new_direction.append("L")
    
    if y_delta > 0:
        new_direction.append("U")
    elif y_delta < 0:
        new_direction.append("D")

    return "".join(new_direction)

def main():
    moves = read_and_parse_input()

    # both the head and tail should start at the origin X, Y (0, 0)
    # set origin as bottom left, so right increases X, up increases Y
    head = (0, 0)
    tail = (0, 0)

    tail_visited = dict()
    tail_visited[tail] = True

    for move_idx, move in enumerate(moves):
        direction, steps = move
        print(f"Move {move_idx} {move}: head: {head}, tail: {tail}")
        for step_idx in range(steps):
            head = determine_new_position(head, direction)
            print(f"  step {step_idx}: head moved to: {head}")
            tail_adjacent = is_adjacent(head, tail)

            print(f"  step {step_idx}: tail_adjacent: {tail_adjacent}")
            if tail_adjacent:
                # don't need to move tail
                continue

            # move the tail towards the head
            tail_direction = determine_new_direction(head, tail)
            tail = determine_new_position(tail, tail_direction)
            print(f"  step {step_idx}: tail moved to: {tail}")
            tail_visited[tail] = True

        print(move_idx, move)

    print(tail_visited.keys())
    print(len(tail_visited.keys()))


if __name__ == "__main__":
    main()
