import { input, signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SimpleTableData } from 'src/components/simple-table/simple-table.component';
import { SilverLink, SilverLinkData } from 'src/services/links.service';
import { v4 as uuidv4 } from 'uuid';

const LoremIpsumExample: string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget ex sollicitudin, dictum elit eu, gravida ex. Nulla fermentum, eros dictum porta consequat, sapien purus facilisis purus, id facilisis diam leo sit amet magna. Mauris id hendrerit neque, tincidunt interdum justo. Nam eu aliquam neque. Quisque porta suscipit massa, vestibulum volutpat nunc. Nullam sed nisl diam. Cras eget maximus sapien, vitae lacinia enim. Donec blandit est pulvinar diam vulputate, fringilla ullamcorper nisl porta. Cras facilisis, neque at convallis interdum, tellus lectus posuere magna, sed fringilla risus eros non mauris. Morbi ultrices aliquet erat in tincidunt. Fusce mi nulla, laoreet efficitur mauris vitae, interdum lacinia sapien.

Suspendisse potenti. Donec vestibulum libero sed condimentum mattis. Praesent eu consequat sem, posuere scelerisque sem. Morbi scelerisque fermentum nunc id pulvinar. Quisque commodo laoreet orci eleifend efficitur. Nam egestas lectus non feugiat elementum. Curabitur lobortis pulvinar suscipit. Duis sodales enim sed volutpat mollis. Aliquam erat volutpat. Cras ullamcorper augue est, nec varius velit porttitor eu. Vestibulum orci purus, porttitor accumsan neque eu, finibus fermentum mauris.

Nullam auctor facilisis neque non aliquam. Fusce ultricies accumsan molestie. In egestas erat eget finibus ullamcorper. Fusce eleifend sollicitudin quam, eu maximus urna. Vivamus leo est, egestas ut dolor ut, suscipit sollicitudin nunc. Cras leo ex, mollis id facilisis in, congue eu odio. In ornare nulla eu consectetur pretium. Fusce sit amet dolor eu urna tempus commodo. Curabitur hendrerit dolor purus. Duis in diam eget lectus euismod ullamcorper. Donec neque lectus, condimentum nec tempor at, elementum a ligula. Proin non ex non sem volutpat iaculis vitae id lectus. Praesent leo erat, aliquet nec pellentesque eu, laoreet eu diam. Aenean gravida vulputate elit, ut malesuada lectus eleifend et.

Ut a nunc dignissim, facilisis erat a, sagittis lacus. Sed auctor eros neque, ut sagittis augue malesuada ut. Proin volutpat, tellus eget commodo semper, urna magna mattis turpis, in elementum erat ex ac neque. Donec nulla justo, faucibus sed lacus ut, ultricies mattis felis. Morbi sit amet enim metus. Quisque in libero at augue mattis malesuada. Pellentesque pellentesque ex nec turpis ullamcorper pretium. Aliquam rhoncus ex quis dolor imperdiet, id laoreet ipsum tincidunt. Nullam quis dolor eu est semper viverra. Quisque vitae metus at dui suscipit fermentum nec et magna. Vivamus facilisis efficitur dictum. Nunc nulla turpis, rhoncus nec ultricies nec, fringilla ut leo. Fusce semper arcu eros.

Vivamus vestibulum porta lacus vitae tincidunt. Proin hendrerit vehicula augue, ultricies suscipit nisi placerat id. Nullam sed porta nisi. Mauris sit amet odio urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus tincidunt eros et mi consectetur, ac rhoncus orci varius. Proin facilisis massa a massa tincidunt sodales. Sed gravida ac tortor a venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam ornare augue a imperdiet interdum. Pellentesque nec sapien ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam porttitor nulla sapien, nec placerat erat mattis vel. Interdum et malesuada fames ac ante ipsum primis in faucibus. `;

const MarkdownExample: string = `# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading

## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


## Blockquotes


> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists
  
* Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    * Facilisis in pretium nisl aliquet
    * Nulla volutpat aliquam velit
* Very easy!`;

const ObjectExample: any = {
  'simple key': 'simple value',
  numbers: 1234567,
  'simple list': ['value1', 22222, 'value3'],
  'special value': undefined,
  owner: null,
  'simple obect': {
    'simple key': 'simple value',
    numbers: 1234567,
    'simple list': ['value1', 22222, 'value3'],
    'simple obect': {
      key1: 'value1',
      key2: 22222,
      key3: 'value3',
    },
  },
};

const TableExample: SimpleTableData = {
  Rows: [
    {
      Header: true,
      Columns: [
        {
          Text: 'Header',
        },
        {
          Text: 'Example',
        },
        {
          Text: 'Table',
        },
      ],
    },
    {
      Columns: [
        {
          Text: 'Example',
        },
        {
          Text: 'Columns',
        },
        {
          Text: '!!!',
        },
      ],
    },
    {
      Header: true,
      Columns: [
        {
          Text: 'Second  ',
          Size: 2,
        },
        {
          Text: 'Header',
          Size: 2,
        },
        {
          Text: 'Row',
          Size: 2,
        },
      ],
    },
    {
      Columns: [
        {
          Text: 'Now With ',
          Size: 2,
        },
        {
          Text: 'Custom ',
          Size: 2,
        },
        {
          Text: 'Sizes',
          Size: 2,
        },
      ],
    },
    {
      Justification: 'around',
      Columns: [
        {
          Text: 'You can Break',
          Size: 3,
        },
        {
          Text: 'The size ',
          Size: 4,
        },
        {
          Text: 'If you want',
          Size: 3,
        },
      ],
    },
    {
      Columns: [
        {
          Text: '1',
          Size: 1,
        },
        {
          Text: '2',
          Size: 1,
        },
        {
          Text: '3',
          Size: 1,
        },
        {
          Text: '4',
          Size: 1,
        },
        {
          Text: '5',
          Size: 1,
        },
        {
          Text: '6',
          Size: 1,
        },
        {
          Text: '7',
          Size: 1,
        },
        {
          Text: '8',
          Size: 1,
        },
        {
          Text: '9',
          Size: 1,
        },
        {
          Text: '10',
          Size: 1,
        },
      ],
    },
  ],
};

export class OutputTestLink implements SilverLink {
  public Error = signal<boolean>(false);
  public Output = signal<SilverLinkData>(new SilverLinkData(''));
  public Disabled = signal<boolean>(false);

  public Id: string = uuidv4();
  public Searchterms: string = 'debug';
  public Name: string = 'Output Test';
  public Category: string = 'Generation';
  public Description: string = 'Sets a series of test output values. ';

  public HasSettings: boolean = false;
  public ShowSettings = signal<boolean>(false);

  public Settings: any;
  public SettingsFormOptions = undefined;
  public SettingsForm: FormlyFieldConfig[] = [];

  public Run(Input: SilverLinkData): SilverLinkData {
    let output = new SilverLinkData();

    output.DataFields.push({});

    output.DataFields[0].Table = TableExample;
    output.DataFields[0].Text = LoremIpsumExample;
    output.DataFields[0].Image = 'assets/test-image.png';
    output.DataFields[0].HTMLString = '<p>Hello</p><ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>';
    output.DataFields[0].Markdown = MarkdownExample;
    output.DataFields[0].Object = ObjectExample;

    return output;
  }

  public New(): SilverLink {
    return new OutputTestLink();
  }

  LoadSettings(Input: any): void {}
}
