"""Core calculator logic for Dentaku."""

from __future__ import annotations

import ast
import operator
from typing import Callable, Dict, Union

Number = Union[int, float]

_OPERATORS: Dict[type, Callable[[Number, Number], Number]] = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
}

_UNARY_OPERATORS: Dict[type, Callable[[Number], Number]] = {
    ast.UAdd: operator.pos,
    ast.USub: operator.neg,
}


class CalculatorError(ValueError):
    """Raised when an expression cannot be evaluated."""


def calculate(expression: str) -> Number:
    """Safely evaluate a mathematical expression.

    Parameters
    ----------
    expression:
        The mathematical expression to evaluate. Supports the operators ``+``,
        ``-``, ``*``, ``/``, ``//``, ``%`` and ``**`` as well as parentheses.

    Returns
    -------
    Number
        The numeric result of the expression.

    Raises
    ------
    CalculatorError
        If the expression contains unsupported syntax.
    ZeroDivisionError
        If the expression attempts to divide by zero.
    """

    try:
        tree = ast.parse(expression, mode="eval")
    except SyntaxError as exc:  # pragma: no cover - ast.parse always raises SyntaxError
        raise CalculatorError("Invalid expression") from exc

    return _evaluate(tree.body)


def _evaluate(node: ast.AST) -> Number:
    if isinstance(node, ast.Num):  # type: ignore[attr-defined]
        return node.n  # type: ignore[return-value]
    if isinstance(node, ast.BinOp):
        op_type = type(node.op)
        if op_type not in _OPERATORS:
            raise CalculatorError(f"Unsupported operator: {op_type.__name__}")
        left = _evaluate(node.left)
        right = _evaluate(node.right)
        return _OPERATORS[op_type](left, right)
    if isinstance(node, ast.UnaryOp):
        op_type = type(node.op)
        if op_type not in _UNARY_OPERATORS:
            raise CalculatorError(f"Unsupported unary operator: {op_type.__name__}")
        operand = _evaluate(node.operand)
        return _UNARY_OPERATORS[op_type](operand)
    if isinstance(node, ast.Expression):
        return _evaluate(node.body)
    if isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)):
            return node.value
        raise CalculatorError(f"Unsupported constant: {node.value!r}")
    raise CalculatorError(f"Unsupported expression: {ast.dump(node)}")
