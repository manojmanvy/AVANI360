import enum


class UserRole(str, enum.Enum):
    buyer = "buyer"
    seller = "seller"
    builder = "builder"
    admin = "admin"


class PropertyType(str, enum.Enum):
    residential_plot = "Residential Plot"
    apartment = "Apartment"
    villa = "Villa"
    farm_land = "Farm Land"
    commercial_plot = "Commercial Plot"
    agricultural_land = "Agricultural Land"


class ListingStatus(str, enum.Enum):
    pending = "Pending"
    approved = "Approved"
    rejected = "Rejected"


class EnquiryStatus(str, enum.Enum):
    new = "New"
    contacted = "Contacted"
    closed = "Closed"


def enum_values(enum_cls: type[enum.Enum]) -> list[str]:
    return [member.value for member in enum_cls]
