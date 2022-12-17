#!/usr/bin/env python3
# No Space Left On Device, part 2
# https://adventofcode.com/2022/day/7

from os import path


def read_and_parse_input():
    # Read input file into memory
    script_dir = path.dirname(path.abspath(__file__))
    input_path = path.join(script_dir, "input.txt")
    # input_path = path.join(script_dir, "example.txt")
    with open(input_path) as file:
        data_lines = file.readlines()

    # Parse file into workable input
    root = {("/",): "DIR"}
    cwd = ["/"]
    for data_line in data_lines:
        data_line = data_line.strip()
        if not data_line:
            continue

        prefix_cd = "$ cd "
        prefix_ls = "$ ls"

        if data_line.startswith(prefix_cd):
            to_dir = data_line[len(prefix_cd) :]
            if to_dir == "/":
                cwd = ["/"]
            elif to_dir == "..":
                cwd.pop()
                if cwd == []:
                    cwd = ["/"]
            else:
                cwd.append(to_dir)
        elif data_line.startswith(prefix_ls):
            continue
        else:
            # assume we're in ls output
            item_type_size, identifier = data_line.split()
            if item_type_size == "dir":
                root[tuple(cwd + [identifier])] = "DIR"
            else:
                root[tuple(cwd + [identifier])] = int(item_type_size)
    return root


def main():
    data = read_and_parse_input()

    dir_sizes = {}

    for path, path_value in data.items():
        if path_value == "DIR":
            continue
        file_dir = path[:-1]
        while file_dir:
            cur_dir_size = dir_sizes.get(file_dir, 0)
            cur_dir_size += path_value
            dir_sizes[file_dir] = cur_dir_size
            file_dir = file_dir[:-1]

    # max space is 70000000, need 30000000 for update
    remaining_space = 70000000 - dir_sizes[("/",)]
    needed_space = 30000000 - remaining_space

    print(dir_sizes, remaining_space, needed_space)
    candidates = []
    for dir_size in dir_sizes.values():
        if dir_size >= needed_space:
            candidates.append(dir_size)
    candidates.sort()
    print(candidates[0])

if __name__ == "__main__":
    main()
