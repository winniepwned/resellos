"""Tests for ResellScore value object."""
import pytest
from src.domain.value_objects.resell_score import ResellScore


def test_valid_score_creation():
    score = ResellScore(value=75)
    assert score.value == 75


def test_score_minimum():
    score = ResellScore(value=1)
    assert score.value == 1


def test_score_maximum():
    score = ResellScore(value=100)
    assert score.value == 100


def test_score_below_minimum_raises():
    with pytest.raises(ValueError):
        ResellScore(value=0)


def test_score_above_maximum_raises():
    with pytest.raises(ValueError):
        ResellScore(value=101)


def test_score_negative_raises():
    with pytest.raises(ValueError):
        ResellScore(value=-1)


def test_color_green_high_score():
    assert ResellScore(value=85).color == "green"


def test_color_green_boundary():
    assert ResellScore(value=70).color == "green"


def test_color_yellow_mid_score():
    assert ResellScore(value=55).color == "yellow"


def test_color_yellow_boundary():
    assert ResellScore(value=40).color == "yellow"


def test_color_red_low_score():
    assert ResellScore(value=20).color == "red"


def test_color_red_boundary():
    assert ResellScore(value=39).color == "red"


def test_label_banger():
    assert ResellScore(value=80).label == "Banger"


def test_label_okay():
    assert ResellScore(value=50).label == "Okay"


def test_label_ladenhueter():
    assert ResellScore(value=15).label == "Ladenhueter"


def test_score_is_immutable():
    score = ResellScore(value=50)
    with pytest.raises(AttributeError):
        score.value = 60
