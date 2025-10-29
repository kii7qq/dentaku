"""Command line interface for Dentaku."""

from __future__ import annotations

import argparse
import sys

from . import calculate, CalculatorError


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Evaluate a mathematical expression.")
    parser.add_argument("expression", help="The expression to evaluate. Use quotes to avoid shell interpretation.")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        result = calculate(args.expression)
    except CalculatorError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    except ZeroDivisionError:
        print("Error: division by zero", file=sys.stderr)
        return 1

    if isinstance(result, float) and result.is_integer():
        result = int(result)
    print(result)
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
