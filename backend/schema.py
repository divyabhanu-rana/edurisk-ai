from enum import Enum
from pydantic import BaseModel, Field, field_validator


# -------------------------
# ENUMS
# -------------------------
class SchoolEnum(str, Enum):
    GP = "GP"
    MS = "MS"


class SexEnum(str, Enum):
    F = "F"
    M = "M"


class AddressEnum(str, Enum):
    U = "U"
    R = "R"


class FamSizeEnum(str, Enum):
    LE3 = "LE3"
    GT3 = "GT3"


class PStatusEnum(str, Enum):
    T = "T"
    A = "A"


class JobEnum(str, Enum):
    teacher = "teacher"
    health = "health"
    services = "services"
    at_home = "at_home"
    other = "other"


class ReasonEnum(str, Enum):
    home = "home"
    reputation = "reputation"
    course = "course"
    other = "other"


class GuardianEnum(str, Enum):
    mother = "mother"
    father = "father"
    other = "other"


class YesNoEnum(str, Enum):
    yes = "yes"
    no = "no"


class SubjectEnum(str, Enum):
    mat = "mat"
    por = "por"


# -------------------------
# REQUEST SCHEMA
# -------------------------
class StudentInput(BaseModel):
    # Categorical
    school: SchoolEnum
    sex: SexEnum
    address: AddressEnum
    famsize: FamSizeEnum
    Pstatus: PStatusEnum
    Mjob: JobEnum
    Fjob: JobEnum
    reason: ReasonEnum
    guardian: GuardianEnum
    schoolsup: YesNoEnum
    famsup: YesNoEnum
    paid: YesNoEnum
    activities: YesNoEnum
    nursery: YesNoEnum
    higher: YesNoEnum
    internet: YesNoEnum
    romantic: YesNoEnum

    # Numeric
    age: int = Field(..., ge=10, le=30)
    Medu: int = Field(..., ge=0, le=4)
    Fedu: int = Field(..., ge=0, le=4)
    traveltime: int = Field(..., ge=1, le=4)
    studytime: int = Field(..., ge=1, le=4)
    failures: int = Field(..., ge=0, le=4)
    famrel: int = Field(..., ge=1, le=5)
    freetime: int = Field(..., ge=1, le=5)
    goout: int = Field(..., ge=1, le=5)
    Dalc: int = Field(..., ge=1, le=5)
    Walc: int = Field(..., ge=1, le=5)
    health: int = Field(..., ge=1, le=5)
    absences: int = Field(..., ge=0, le=100)
    G1: int = Field(..., ge=0, le=20)
    G2: int = Field(..., ge=0, le=20)

    # Required only if model trained with both datasets
    subject: SubjectEnum = SubjectEnum.mat

    # Normalize common mixed-case inputs for yes/no fields
    @field_validator(
        "schoolsup", "famsup", "paid", "activities", "nursery",
        "higher", "internet", "romantic",
        mode="before"
    )
    @classmethod
    def normalize_yes_no(cls, v):
        if isinstance(v, str):
            return v.strip().lower()
        return v