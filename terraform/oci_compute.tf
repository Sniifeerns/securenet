
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
      ssh_authorized_keys = var.ssh_public_key
      user_data = filebase64("./scripts/init-server.sh")
    }
}

