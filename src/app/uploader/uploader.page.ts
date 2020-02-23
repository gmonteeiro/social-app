import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';


@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})
export class UploaderPage implements OnInit {

  imageURL: string
  desc: string

  @ViewChild('fileButton', {static: false}) fileButton

  constructor(
    public http: HttpClient,
    public afstore: AngularFirestore,
    public user: UserService
  ) { }

  ngOnInit() {
  }

  createPost(){
    const image = this.imageURL
    const desc = this.desc

    this.afstore.doc(`users/${this.user.getUID()}`).set({
      posts: firestore.FieldValue.arrayUnion(image) 
    })

    this.afstore.doc(`posts/${image}`).set({
      desc,
      author: this.user.getUsername(),
      likes: []
    })

  }

  uploadFire(){
    this.fileButton.nativeElement.click()
  }

  fileChanged(event){
    const files = event.target.files
    console.log(files)

    const data = new FormData()
    data.append('file', files[0])
    data.append('UPLOADCARE_STORE','1')
    data.append('UPLOADCARE_PUB_KEY', 'ba915192496d3b743d59')

    this.http.post("https://upload.uploadcare.com/base/", data)
    .subscribe(event => {
      console.log(event)
      this.imageURL = event.file
    })
  }

}
