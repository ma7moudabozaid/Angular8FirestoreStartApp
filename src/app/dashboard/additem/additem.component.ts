import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Category } from './category';
@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export class AdditemComponent implements OnInit {


  catCol: AngularFirestoreCollection<any>;
  catDoc: AngularFirestoreDocument<any>;
  items: Observable<any[]>;
  searchText: string = "";


  editState: boolean = false;
  itemToEdit: Category;

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;

  downloadURL: Observable<string>;
  imageURL: string


  category: Category = {
    name: '',
    desc: '',
    image: '',
    createAt: new Date()
  }
  constructor(public afs: AngularFirestore, private toastr: ToastrService, private afStorage: AngularFireStorage) {

    this.catCol = afs.collection('Items', ref => ref.orderBy('ordering', 'asc'));
    this.items = this.catCol.valueChanges();

    this.items = this.catCol.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Category;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

  }

  ngOnInit() {
  }

  upload(event) {

    const file = event.target.files[0];
    const filePath = `Items/${Math.random().toString(36).substring(2)}`;
    const fileRef = this.afStorage.ref(filePath);
    const task = fileRef.put(file);
    this.downloadURL = fileRef.getDownloadURL();
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL()
        this.downloadURL.subscribe(url => {
          if (url) { this.imageURL = url }
        })
      }
      )).subscribe()
  }

  addCategory() {

    this.catCol.add({
      name: this.category.name,
      desc: this.category.desc,
      image: this.imageURL,
      createAt: this.category.createAt
    })

    this.toastr.success(' Add Succssfuly ');
  }


  editItem(event, category: Category) {
    this.editState = true;
    this.itemToEdit = category;
  }

  updateItem(category: Category) {
    this.catDoc = this.afs.doc(`Items/${category.id}`);
    this.catDoc.update(category);
    this.toastr.success(' Edit Succssfuly ');

  }

  deleteCat(category: Category) {
    this.catCol.doc(category.id).delete();
    this.toastr.error('   Delete Succssfuly');
  }

  filterCondition(category) {
    return category.categoryName.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1;
  }


}
