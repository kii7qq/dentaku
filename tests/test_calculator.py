"""Tests for the Dentaku calculator."""

import math

import pytest

from dentaku import calculate, CalculatorError


@pytest.mark.parametrize(
    "expression, expected",
    [
        ("1 + 2", 3),
        ("2 - 5", -3),
        ("4 * 3", 12),
        ("8 / 4", 2),
        ("7 // 3", 2),
        ("7 % 3", 1),
        ("2 ** 3", 8),
        ("-(5 - 2)", -3),
        ("(2 + 3) * 4", 20),
        ("3.5 + 2.5", 6.0),
    ],
)
def test_calculate(expression, expected):
    assert calculate(expression) == expected


def test_division_by_zero():
    with pytest.raises(ZeroDivisionError):
        calculate("1 / 0")


def test_invalid_expression():
    with pytest.raises(CalculatorError):
        calculate("import os")


def test_disallows_strings():
    with pytest.raises(CalculatorError):
        calculate("'hello'")


def test_large_expression():
    expression = " + ".join(str(i) for i in range(100))
    assert calculate(expression) == sum(range(100))


def test_handles_float_rounding():
    result = calculate("0.1 + 0.2")
    assert math.isclose(result, 0.3, rel_tol=1e-9)
