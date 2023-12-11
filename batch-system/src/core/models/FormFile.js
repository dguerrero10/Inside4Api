class FormFile {
    constructor(formType, companyName, CIK, dateFiled, url){
        this.formType = formType
        this.companyName = companyName
        this.CIK = CIK
        this.dateFiled = dateFiled
        this.url = url
    }

    toString(){
        return `FormFile: ------------------ 
            formType: ${this.formType}
            company: ${this.companyName}
            CIK: ${this.CIK}
            dateFiled: ${this.dateFiled}
            url: ${this.url}
        `
    }
}