class IpTables {

  constructor() {
    this.ipTableContent = document.querySelector('table#iptable tbody')
    this.addressForm = document.querySelector('form#add-ip')
    this.addressInput = Array.from(this.addressForm.querySelectorAll('input'))
    this.addButton = document.querySelector('button')
    this.editingRow = null
    
    this.loadAddAddreessEvent(this.addButton)
  }

  // View
  genRowContent(address) {
    const row = `<tr data-ip="${address.ip}">
      <td class="ip">${address.ip}</td>
      <td class="mask">${address.mask}</td>
      <td class="version">${address.version}</td>
      <td>
        <i class="material-icons edit-icon" data-edit>edit</i>
        <i class="material-icons delete-icon" data-delete>delete</i>
      </td>
    </tr>`

    this.ipTableContent.insertAdjacentHTML('afterbegin', row)
    
    // Adiciona eventos para a nova linha
    const newRow = this.ipTableContent.querySelector('tr')
    this.attachRowEvents(newRow)
  }
  
  attachRowEvents(row) {
    const editIcon = row.querySelector('[data-edit]')
    const deleteIcon = row.querySelector('[data-delete]')
    
    editIcon.addEventListener('click', () => this.editRow(row))
    deleteIcon.addEventListener('click', () => this.deleteRow(row))
  }
  
  editRow(row) {
    const ip = row.querySelector('.ip').textContent
    const mask = row.querySelector('.mask').textContent
    const version = row.querySelector('.version').textContent
    
    // Preenche o formulário com os dados
    document.querySelector('#ip').value = ip
    document.querySelector('#mask').value = mask
    document.querySelector('#version').value = version
    
    // Marca que estamos editando
    this.editingRow = row
    this.addButton.textContent = 'Save'
    
    // Foca no primeiro input
    document.querySelector('#ip').focus()
  }
  
  deleteRow(row) {
    row.remove()
  }

  ipExists(ip) {
    const rows = this.ipTableContent.querySelectorAll('tr')
    return Array.from(rows).some(row => row.querySelector('.ip').textContent === ip)
  }
  
  // Events
  loadAddAddreessEvent(addButton) {
    addButton.addEventListener('click', (event) => {
      event.preventDefault()

      const formData = new FormData(this.addressForm)
      const ip = formData.get('ip') || '-'
      const mask = formData.get('mask') || '-'
      const version = formData.get('version') || '-'
      const address = { ip, mask, version }

      if (this.editingRow) {
        // Atualiza a linha existente
        this.editingRow.querySelector('.ip').textContent = ip
        this.editingRow.querySelector('.mask').textContent = mask
        this.editingRow.querySelector('.version').textContent = version
        this.editingRow.setAttribute('data-ip', ip)
        
        // Reseta o modo de edição
        this.editingRow = null
        this.addButton.textContent = 'Add'
      } else {
        // Verifica se o IP já existe
        if (this.ipExists(ip)) {
          alert('Este endereço IP já está cadastrado!')
          return
        }
        // Adiciona uma nova linha
        this.genRowContent(address)
      }
      
      this.addressInput.forEach(input => input.value = '')
      addButton.blur()
    })
  }

}

const iptables = new IpTables()
