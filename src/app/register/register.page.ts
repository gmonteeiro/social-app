import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth} from 'firebase/app'
import { Router } from '@angular/router'

import { AngularFirestore } from '@angular/fire/firestore'

import {AlertController} from '@ionic/angular'
import { UserService } from '../user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

	username: string = ""
	password: string = ""
	cpassword: string = ""
	AlertController: any;

  	constructor(
		public afAuth: AngularFireAuth,
		public alertController: AlertController,
		public router: Router,
		public user: UserService,
		public afstore: AngularFirestore,
	) { }

	ngOnInit() {
	}

	async presentAlert(title: string, content: string){
		const alert = await this.alertController.create({
			header: title,
			message: content,
			buttons: ['Ok']
		})
	}

	async register() {
		const {username, password, cpassword} = this
		if(password !== cpassword){
			this.showAlert("Error!", "Passwords don't match")
			return console.error("password don't match!");
		}

		try{
			const res = await this.afAuth.auth.createUserWithEmailAndPassword(username + "@social-app.com", password)
			
			this.afstore.doc(`users/${res.user.uid}`).set({
				username
			})

			this.user.setUser({
				username,
				uid: res.user.uid
			})

			this.presentAlert('Success', 'You are registered!')
			this.router.navigate(['/tabs'])

		}catch(err){
			this.showAlert("Error!", err.message)
			console.dir(err)
		}
	}

	async showAlert(header: string, message: string){
		const alert = await this.alertController.create({
			header,
			message,
			buttons: ["Ok"]
		})

		await alert.present()
	}

}
