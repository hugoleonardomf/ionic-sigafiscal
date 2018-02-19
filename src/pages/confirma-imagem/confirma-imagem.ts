import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';
import { FiscalProvider, PastaList, Arquivo } from '../../providers/fiscal/fiscal';
import { DatePipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-confirma-imagem',
  templateUrl: 'confirma-imagem.html',
})

export class ConfirmaImagemPage {

  model: Arquivo;
  pastaList: PastaList;
  base64Image: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fiscalProvider: FiscalProvider, private datepipe: DatePipe, private alertCtrl: AlertController) {
    this.pastaList = this.navParams.get('pastaList');
    if(this.navParams.get('arquivo')){ //edit
      this.model = this.navParams.get('arquivo');
      this.base64Image = this.model.imagem;
    }
    else { //create
      this.model = new Arquivo();
      this.base64Image = this.navParams.get('base64Image');
    }
  }

  save() {
    this.saveImagem()
      .then(() => {
        this.navCtrl.pop();
      })
      .catch(() => {
        console.log('erro');
      });
  }

  private saveImagem() {
    if (!this.model.id) { //insert
      this.model.id = this.datepipe.transform(new Date(), "ddMMyyyyHHmmss");
      this.model.imagem = this.base64Image;
      this.model.criacao = new Date();
      this.pastaList.pasta.arquivos.push(this.model);
    }
    return this.fiscalProvider.updatePasta(this.pastaList.key, this.pastaList.pasta);
  }

  private remove() {
    this.pastaList.pasta.arquivos.splice(this.pastaList.pasta.arquivos.indexOf(this.model), 1);
    this.fiscalProvider.updatePasta(this.pastaList.key, this.pastaList.pasta);
    this.navCtrl.pop();
  }

  confirmRemove() {
    let alert = this.alertCtrl.create({
      title: 'Deseja excluir?',
      message: 'Essa ação não poderá ser desfeita!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Excluir',
          handler: () => {
            this.remove();
          }
        }
      ]
    });
    alert.present();
  }

}
