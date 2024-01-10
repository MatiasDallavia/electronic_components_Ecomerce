import graphene
from graphene_django.types import DjangoObjectType
from products.models import BJT, IGBT, MOSFET, Capacitor, Diode, Inductor, Resistor
from products.schema.enums import (
    BJTPackagesOptionsEnum,
    BJTTypesEnum,
    IGBTPackagesOptionsEnum,
    ManufacturerEnum,
    MOSFETPackagesOptionsEnum,
    MountingTechnologyEnum,
)


class ProductTypeField(graphene.ObjectType):
    component_type = graphene.String()


class CapacitorType(DjangoObjectType, ProductTypeField):
    class Meta:
        model = Capacitor
        fields = "__all__"

    def resolve_component_type(self, info):
        return "capacitor"


class ResistorType(DjangoObjectType, ProductTypeField):
    class Meta:
        model = Resistor
        fields = "__all__"

    def resolve_component_type(self, info):
        return "resistor"


class DiodeType(DjangoObjectType, ProductTypeField):
    class Meta:
        model = Diode
        fields = "__all__"

    def resolve_component_type(self, info):
        return "diode"


class InductorType(DjangoObjectType, ProductTypeField):
    class Meta:
        model = Inductor
        fields = "__all__"

    def resolve_component_type(self, info):
        return "inductor"


class BaseProductModelType(graphene.ObjectType):
    id = graphene.ID()
    product_id = graphene.UUID()
    model = graphene.String()
    description = graphene.String()
    price = graphene.Float()
    mounting_technology = graphene.String()
    operating_temperature = graphene.Float()
    amount_available = graphene.Int()
    manufacturer = graphene.String()
    is_active = graphene.Boolean()


class BJTType(BaseProductModelType, ProductTypeField):
    package = graphene.String()
    bjt_type = graphene.String()
    ic_max = graphene.Float()
    vce_saturation = graphene.Float()
    dc_current_gain = graphene.Float()

    def resolve_component_type(self, info):
        return "bjt"


class MOSFETType(BaseProductModelType, ProductTypeField):
    package = graphene.String()
    vds = graphene.Float()
    drive_voltage = graphene.Float()
    rds_on = graphene.Float()
    vgs = graphene.Float()
    input_capacitance = graphene.Float()

    def resolve_component_type(self, info):
        return "mosfet"


class IGBTType(BaseProductModelType, ProductTypeField):
    package = graphene.String()
    vc = graphene.Float()
    ic = graphene.Float()
    vce_on = graphene.Float()
    power_max = graphene.Float()
    td = graphene.Float()
    gc = graphene.Float()

    def resolve_component_type(self, info):
        return "igbt"


class TransistorType(graphene.Union):
    class Meta:
        types = (BJTType, MOSFETType, IGBTType)
