#!/usr/bin/env python3
# Tuning Trouble
# https://adventofcode.com/2022/day/6

from os import path


def read_and_parse_input():
    # Read input file into memory
    script_dir = path.dirname(path.abspath(__file__))
    input_path = path.join(script_dir, "input.txt")
    # input_path = path.join(script_dir, "example.txt")
    with open(input_path) as file:
        data_lines = file.readlines()

    # Parse file into workable input
    stream = ()
    for data_line in data_lines:
        data_line = data_line.strip()
        stream = tuple(data_line)
    return stream


def main():
    data = read_and_parse_input()
    # packet_len = 4 (part 1)
    packet_len = 14  # (part 2)
    for i in range(len(data)):
        if i < packet_len:
            continue
        if len(set(data[i - packet_len : i])) == packet_len:
            print(i)
            break


if __name__ == "__main__":
    main()
