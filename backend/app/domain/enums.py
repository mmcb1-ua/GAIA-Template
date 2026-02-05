from enum import Enum

class NewsStatus(str, Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"

class NewsScope(str, Enum):
    GENERAL = "GENERAL"
    INTERNAL_ASOCIACION = "INTERNAL_ASOCIACION"
