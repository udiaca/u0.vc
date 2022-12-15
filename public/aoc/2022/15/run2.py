#!/usr/bin/env python3
# Beacon Exclusion Zone, part 2
# https://adventofcode.com/2022/day/15

from collections import namedtuple
from os import path

Sensor = namedtuple(
    "Sensor", ["sensor_pos", "nearest_beacon_pos", "nearest_beacon_dist"]
)


use_example = False
# use_example = True
print_verbose_val = False
# print_verbose_val = True


def print_verbose(val):
    if print_verbose_val:
        print(val)


def read_and_parse_input():
    # read input file into memory
    script_dir = path.dirname(path.abspath(__file__))
    input_path = path.join(script_dir, "input.txt")
    if use_example:
        input_path = path.join(script_dir, "example.txt")
    with open(input_path) as file:
        data_lines = file.readlines()

    data = []

    prefix_sensor = "Sensor at x="
    prefix_beacon = "closest beacon is at x="

    for data_line in data_lines:
        data_line = data_line.strip()

        sensor_raw, beacon_raw = data_line.split(": ")
        sensor_pos_x, sensor_pos_y = sensor_raw[len(prefix_sensor) :].split(", y=")
        beacon_pos_x, beacon_pos_y = beacon_raw[len(prefix_beacon) :].split(", y=")

        sensor_pos = (int(sensor_pos_x), int(sensor_pos_y))
        nearest_beacon_pos = (int(beacon_pos_x), int(beacon_pos_y))
        nearest_beacon_dist = manhattan_distance(sensor_pos, nearest_beacon_pos)

        data.append(
            Sensor(
                sensor_pos=sensor_pos,
                nearest_beacon_pos=nearest_beacon_pos,
                nearest_beacon_dist=nearest_beacon_dist,
            )
        )

    return data


def manhattan_distance(posA, posB):
    deltas = [v[0] - v[1] for v in zip(posA, posB)]
    abs_deltas = [abs(v) for v in deltas]
    return sum(abs_deltas)


def print_grid(grid, world_boundary_x_y, sensor=None):
    (world_min_x, world_max_x, world_min_y, world_max_y) = world_boundary_x_y
    for row_idx in range(world_min_y, world_max_y):
        print_row = []
        for col_idx in range(world_min_x, world_max_x):
            val = grid.get((col_idx, row_idx), ".")
            if sensor is None or val != ".":
                print_row.append(val)
                continue

            cell_dist = manhattan_distance((col_idx, row_idx), sensor.sensor_pos)
            if cell_dist <= sensor.nearest_beacon_dist:
                val = "#"
            print_row.append(val)

        grid_row = "".join(print_row)
        grid_row_with_row_idx = f"{row_idx:<3} {grid_row}"
        print(grid_row_with_row_idx)


def main():
    data = read_and_parse_input()

    # part 2 shrinks the world bounder to known x and y min/max
    world_min_x = 0
    world_min_y = 0
    world_max_x = 4000000
    world_max_y = 4000000

    if use_example:
        world_max_x = 20
        world_max_y = 20

    # beacon has x y between 0, 4000000
    for row_idx in range(world_max_y + 1):
        intervals = []
        for sensor in data:
            sensor_x, sensor_y = sensor.sensor_pos
            row_dist = sensor.nearest_beacon_dist - abs(sensor_y - row_idx)

            if row_dist < 0:
                continue

            sensor_x_low = sensor_x - row_dist
            sensor_x_high = sensor_x + row_dist

            intervals.append((sensor_x_low, sensor_x_high))

        intervals.sort()

        candidate = []
        for sensor_x_low, sensor_x_high in intervals:
            if not candidate:
                candidate.append([sensor_x_low, sensor_x_high])
                continue

            _qlo, qhi = candidate[-1]

            if sensor_x_low > qhi + 1:
                candidate.append([sensor_x_low, sensor_x_high])
                continue

            candidate[-1][1] = max(qhi, sensor_x_high)

        x = 0
        for sensor_x_low, sensor_x_high in candidate:
            if x < sensor_x_low:
                print(f"beacon at {(x, row_idx)}")
                print(x * 4000000 + row_idx)
                return
            x = max(x, sensor_x_high + 1)
            if x > world_max_y:
                break


if __name__ == "__main__":
    main()
