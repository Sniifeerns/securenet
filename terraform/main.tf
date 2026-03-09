variable "aws_region" {
    description = "Donde se encuentra SecureNet" 
    type       = string
    default = "eu-west-3"

}
variable "oci_region" {
    description = "Donde se encuentra SecureNet" 
    type       = string
    default = "eu-madrid-1"
  
}
variable "oci_compartment_id" {

    description = "nombre del compartment"
    type = string
    default = "nombre del compartment"

}
variable "environment" {
    description = "En que entorno se va a ejecutar"
    type       = string
    default = "dev"
}
variable "oci_subnet_id" {
    description = "id de la subnet"
    type = string
    default = " "
}
variable "oci_image_id" {
    description = "id de la imagen"
    type = string
    default = " "
  
}
variable "oci_availability_domain" {
    description = "dominio de disponibilidad"
    type = string
    default = " "
}
provider "aws" {
    region = var.aws_region
}
provider "oci" {
    region = var.oci_region
}

resource "aws_s3_bucket" "bucket" {
    bucket = "bucket-securenet-sniifeer-${var.environment}"
}

resource "oci_core_instance" "instance" {
    availability_domain = var.oci_availability_domain
    compartment_id = var.oci_compartment_id
    shape = "VM.Standard.A1.Flex"
    shape_config {
        ocpus = 4
        memory_in_gbs = 24
    }
 source_details {
      source_type = "image"
      source_id = var.oci_image_id
    }   
    create_vnic_details {
      subnet_id = var.oci_subnet_id
    }
    metadata = {
      ssh_authorized_keys = file("~/.ssh/id_rsa.pub")
    }
}
output "ip_public" {
    value = oci_core_instance.instance.public_ip

}
